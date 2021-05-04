import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import Quill from 'quill';

import ImageResize from 'quill-image-resize';

import QuillImageDropAndPaste from 'quill-image-drop-and-paste';

import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import {
  TOOLBAR_OPTIONS,
  SAVE_INTERVAL_MS,
  deleteImages,
  getImgUrls,
  saveToServer,
} from './TextEditorUtils';
function TextEditor() {
  const { id: documentId } = useParams();
  // console.log(documentId);
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  const wrapperRef = useCallback(
    (wrapper) => {
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
              const file = imageData.toFile(
                `${uuidV4()}.${type.split('/')[1]}`
              );
              saveToServer(file, documentId, q);
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
          saveToServer(file, documentId, q);
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
    },
    [documentId]
  );

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
