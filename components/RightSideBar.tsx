import React from "react";

const RightSideBar = () => {
  return (
    <section className="flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 minw-[227px] sticky
    right-0 h-full max-sm:hidden select-none overflow-y-auto pb-20">
      <h3 className="px-5 pt-4 text-xs uppercase">
        Elements
      </h3>
    </section>
  );
};

export default RightSideBar;
