import images from '../api/images.api';

export const SAVE_INTERVAL_MS = 2000;
export const TOOLBAR_OPTIONS = [
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
export function getImgUrls(delta) {
  return delta.ops
    .filter((i) => i.insert && i.insert.image)
    .map((i) => {
      // console.log(i.insert.image)
      return i.insert.image;
    });
}
export function deleteImages(urls) {
  urls.forEach((url) => {
    const location = url.replace(process.env.REACT_APP_BASE_URL + '/', '');
    images.delete(location);
  });
}
export function saveToServer(file, documentId, quill) {
  images
    .save(file, documentId)
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
