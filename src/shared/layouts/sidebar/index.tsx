import React from "react";
import Avatar from "@/shared/components/avatar";

const Sidebar = () => {
  return (
    <div className="">
      <div className="w-16 bg-black1 h-screen flex justify-center">
        <Avatar className='mt-8 mb-4' url="https://picsum.photos/200/200" />
      </div>
    </div>
  );
};

export default Sidebar;
