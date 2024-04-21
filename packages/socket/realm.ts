import { jwtDecode } from "jwt-decode"
import axios from "axios"

// export const getRealmToken = async () => {

// }

let accessToken: string

const checkAdminTokenValid = () => {
  const dCtk = jwtDecode(accessToken)
  if (!dCtk?.exp) return false
  return dCtk.exp > Date.now() / 1000
}

export const getAdminToken = async () => {
  if (!accessToken || !checkAdminTokenValid()) {
    const res = await axios.post(
      "https://services.cloud.mongodb.com/api/admin/v3.0/auth/providers/mongodb-cloud/login",
      { username: "floifyha", apiKey: "105e07f7-7091-4637-9e92-217d827a562f" }
    )
    accessToken = res.data.access_token
  }
  return accessToken
}
export interface ITokenResult {
  _id: string
  uid: string
  email: string
  created_at: {
    $date: {
      $numberLong: string
    }
  }
}
export const verifyRealmToken = async (token: string): Promise<ITokenResult | false> => {
  try {
    const adminToken = await getAdminToken()
    const res = await axios.post(
      "https://services.cloud.mongodb.com/api/admin/v3.0/groups/6329618cfe18f60df52316d9/apps/66223c517b1b60cf65029cc4/users/verify_token",
      { token },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    )
    if (res.data === "token expired") {
      return false
    }

    //   "custom_user_data": {
    //     "_id": "6622b4616e49de6865c9b07c",
    //     "uid": "6622b4616e49de6865c9b07b",
    //     "email": "ironpan21@gmail.com",
    //     "created_at": {
    //         "$date": {
    //             "$numberLong": "1713550433582"
    //         }
    //     }
    // },
    return res.data.custom_user_data
  } catch (e) {
    console.log(e)
    return false
  }
}

