import * as athlete from "./athlete"
import * as coach from "./coach"
import * as guest from "./guest"



export const currentUser = () => ({
  _id: "Coach:adamdickinson",
  firstName: "Adam",
  lastName: "Dickinson",
  position: "Coach"
})



export default { ...athlete, ...coach, ...guest, currentUser }
