import { useStore } from "../store";

export const AsideBar = () => {
  const asideShow = useStore("asideShow");

  return (
    <aside
      className={`${asideShow ? "w-[300px]" : "w-0"} h-full bg-red-500`}
    ></aside>
  );
};
