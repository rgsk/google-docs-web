const images = {
  delete: (location) => {
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
  },
  save: (file, documentId) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(
      `${process.env.REACT_APP_BASE_URL}/assets?documentId=${documentId}`,
      {
        method: 'POST',
        body: formData,
      }
    ).then((response) => response.json());
  },
};
export default images;
