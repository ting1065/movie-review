import { Form, redirect, useNavigate, } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { getUserFromDB, updateUserInDB } from "../dataFetchFunctions";

export async function action({request}) {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken");
  const name = formData.get("name");
  const introduction = formData.get("introduction");

  if (!name || !introduction) {
    alert("name and introduction cannot be empty!");
    return redirect("/profile/edit");
  }

  if (name.length > 20) {
    alert("name too long, no more than 20 characters");
    return redirect("/profile/edit");
  }

  if (introduction.length > 1000) {
    alert("introduction too long, no more than 1000 characters");
    return redirect("/profile/edit");
  }

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
    <Form className="row profile-form" method="post">
        <label className="detail-element detail-prompt profile-element" htmlFor="name">Name</label>
        <textarea className="detail-element profile-element edit-content" rows={1} id="name" type="text" name="name" defaultValue={userFromDB ? userFromDB.name : ""} placeholder="enter your preferred name"/>
        <label className="detail-element detail-prompt profile-element" htmlFor="introduction">Self-introduction</label>
        <textarea className="detail-element profile-element edit-content" rows={20} type="text" id="introduction" name="introduction" defaultValue={userFromDB ? userFromDB.selfIntroduction ? userFromDB.selfIntroduction : "" : ""} placeholder="describe yourslef"/>
        <input type="hidden" name="accessToken" value={accessToken ? accessToken : ""}/>
        <div className="detail-element profile-element button-wrapper">
          <button className="edit-area-button" type="submit">update</button>
          <button className="edit-area-button" type="button" onClick={() => {
              navigate(-1);
            }}>cancel</button>
        </div>
    </Form>
  )
}
