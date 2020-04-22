export function FileInput(input, onChange) {
  function showPreview (loadedFile) {
    const reader  = new FileReader();
    reader.onloadend = function () {
      setImage(reader.result);
    }
    reader.readAsDataURL(loadedFile);
  }


}
