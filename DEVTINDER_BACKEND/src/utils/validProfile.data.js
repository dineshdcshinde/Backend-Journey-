// export const validProfileData = (req) => {
//   const isAllowedFeild = [
//     "name",
//     "username",
//     "age",
//     "email",
//     "location",
//     "profilePicture",
//     "interest",
//     "bio",
//     "lookingFor"
//   ];

//   if (!req.body) {
//     return "No data found";
//   }

//   const requestedFeilds = Object.keys(req.body);

//   const isValidFeildsData = requestedFeilds.every((feild) =>
//     isAllowedFeild.includes(feild)
//   );

//   console.log("I am running")
//   return isValidFeildsData;
// };

export const validProfileData = (req) => {
  const isAllowedFeild = [
    "name",
    "username",
    "age",
    "email",
    "location",
    "profilePicture",
    "interest",
    "bio",
    "lookingFor",
  ];

  const isEditAllowed = Object.keys(req.body).every((feild) =>
    isAllowedFeild.includes(feild)
  );

  console.log(isEditAllowed)
  return isEditAllowed;
};
