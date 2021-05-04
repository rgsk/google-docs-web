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
    .map((i) => i.insert.image);
}
export function deleteImages(deletedImageUrls) {
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
export function saveToServer(file, documentId, quill) {
  const formData = new FormData();
  formData.append('image', file);
  fetch(`${process.env.REACT_APP_BASE_URL}/assets?documentId=${documentId}`, {
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
