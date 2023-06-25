import { Form, redirect, useNavigate, } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { getUserFromDB, updateUserInDB } from "../functions";

export async function action({request}) {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken");
  const name = formData.get("name");
  const introduction = formData.get("introduction");
  await updateUserInDB(accessToken, name, introduction);
  return redirect("/profile");
}

export default function UserProfileEdit() {
  const { accessToken } = useAuthToken();
  const [userFromDB, setUserFromDB] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setUserFromDB(await getUserFromDB(accessToken));
    })();
  }, [accessToken]);


  return (
    <Form method="post">
      <div>
        <label htmlFor="name">name</label>
        <textarea rows={1} type="text" name="name" defaultValue={userFromDB ? userFromDB.name : ""} placeholder="enter your preferred name"/>
        <label htmlFor="introduction">self-introduction</label>
        <textarea type="text" name="introduction" defaultValue={userFromDB ? userFromDB.selfIntroduction ? userFromDB.selfIntroduction : "" : ""} placeholder="describe yourslef"/>
        <input type="hidden" name="accessToken" value={accessToken ? accessToken : ""}/>
        <button type="submit">update</button>
        <button type="button" onClick={() => {
            navigate(-1);
          }}>cancel</button>
      </div>
    </Form>
  )
}
