import Image from "next/image";
import Link from "next/link";

import avatar from "../../public/images/team/team-01.jpg";
import UserMenuItems from "./HeaderProps/UserMenuItems";

import { useSession, signIn, signOut } from "next-auth/react";

const UserMenu = () => {
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn();
  };
  
  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <div className="inner">
        <div className="rbt-admin-profile">
          <div className="admin-thumbnail">
            <Image src={session?.user?.user?.avatar} alt={session?.user?.user?.full_name} width={128} height={128} />
          </div>
          <div className="admin-info">
            <span className="name">{ session?.user?.user.full_name }</span>
            <Link
              className="rbt-btn-link color-primary"
              href="/profile-details"
            >
              View Profile
            </Link>
          </div>
        </div>
        <UserMenuItems parentClass="user-list-wrapper user-nav" />
        <hr className="mt--10 mb--10" />
        <ul className="user-list-wrapper user-nav">
          <li>
            <Link href="#">
              <i className="feather-help-circle"></i>
              <span>Help Center</span>
            </Link>
          </li>
          <li>
            <Link href="/profile-details">
              <i className="feather-settings"></i>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
        <hr className="mt--10 mb--10" />
        <ul className="user-list-wrapper">
          <li>
            <Link href="/auth/signout">
              <i className="feather-log-out"></i>
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default UserMenu;
