import { josmLocalStorageReflection } from "josm-adapter"

export const cookieSettings = josmLocalStorageReflection<boolean>("allowCookies", null)
export default cookieSettings
