const profileImages = [
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/animals-06_x6wtpp.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/animals-02_y9hhez.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/tiger_bd3600.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/animals-05_err6w0.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082544/avatars/lion_eofujq.jpg",
    "https://res.cloudinary.com/dmygcaifb/image/upload/v1586082543/avatars/gorilla_zc1zxj.jpg",
  ];

  const generateImgUrl = ()=>{
  	return profileImages[Math.floor(Math.random() * 6)];
  }

  module.exports = generateImgUrl;