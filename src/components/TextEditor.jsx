import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import Quill from 'quill';

import ImageResize from 'quill-image-resize';

import QuillImageDropAndPaste from 'quill-image-drop-and-paste';

import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquoute', 'code-block', 'link'],
  ['clean'],
];

function TextEditor() {
  const { id: documentId } = useParams();
  // console.log(documentId);
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper === null) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    Quill.register('modules/imageResize', ImageResize);
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        imageResize: {},
        imageDropAndPaste: {
          handler: (dataUrl, type, imageData) => {
            const file = imageData.toFile(`${uuidV4()}.${type.split('/')[1]}`);
            saveToServer(file, q);
          },
        },
      },
    });
    q.disable();
    q.setText('Loading...');
    q.getModule('toolbar').addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();
      input.onchange = () => {
        const file = input.files[0];
        saveToServer(file, q);
      };
    });
    setQuill(q);

    q.on('text-change', (delta, oldContents, source) => {
      if (source !== 'user') return;
      const deleted = getImgUrls(q.getContents().diff(oldContents));
      if (deleted.length) {
        // console.log('delete', deleted);
        deleteImages(deleted);
      }
    });

    function getImgUrls(delta) {
      return delta.ops
        .filter((i) => i.insert && i.insert.image)
        .map((i) => i.insert.image);
    }
  }, []);
  function deleteImages(deletedImageUrls) {
    deletedImageUrls.forEach((url) => {
      const location = url.replace(process.env.REACT_APP_BASE_URL + '/', '');
      // console.log(location);
      fetch(process.env.REACT_APP_BASE_URL + '/assets', {
        method: 'DELETE',
        body: JSON.stringify({
          value: location,
        }),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  }
  function saveToServer(file, quill) {
    const formData = new FormData();
    formData.append('image', file);
    fetch(process.env.REACT_APP_BASE_URL + '/assets', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        const range = quill.getSelection();
        quill.insertEmbed(
          range.index,
          'image',
          `${process.env.REACT_APP_BASE_URL}/${result.asset.value}`
        );
        quill.setSelection(range.index + 1);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  useEffect(() => {
    // console.log(process.env.REACT_APP_BASE_URL);
    const s = io(`${process.env.REACT_APP_BASE_URL}`);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);
  useEffect(() => {
    if (socket && quill) {
      socket.once('load-document', (document) => {
        quill.setContents(document);
        quill.enable(true);
      });
      //   console.log(documentId);
      socket.emit('get-document', documentId);
    }
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket && quill) {
      const interval = setInterval(() => {
        socket.emit('save-document', quill.getContents());
      }, SAVE_INTERVAL_MS);
      return () => {
        clearInterval(interval);
      };
    }
  }, [socket, quill]);
  useEffect(() => {
    if (socket && quill) {
      const handler = (delta, oldDelta, source) => {
        if (source !== 'user') return;
        // source can be api or user
        // we only want to emit changes made by user
        // not those made by api
        socket.emit('send-changes', delta);
      };
      quill.on('text-change', handler);
      return () => {
        quill.off('text-change', handler);
      };
    }
  }, [socket, quill]);
  useEffect(() => {
    if (socket && quill) {
      const handler = (delta) => {
        quill.updateContents(delta);
      };
      socket.on('receive-changes', handler);
      return () => {
        socket.off('receive-changes', handler);
      };
    }
  }, [socket, quill]);
  return <div className="container" ref={wrapperRef}></div>;
}

export default TextEditor;
