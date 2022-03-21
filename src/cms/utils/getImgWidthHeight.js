
export default function getImgWidthHeight(myImg) {
  const img = new Image()
  img.src = myImg
  const imgInfo = {}
  return new Promise((resolve, reject) => {
    img.onload = () => {
      imgInfo.width = img.width
      imgInfo.height = img.height
      resolve(imgInfo)
    }
  })
}
