import { HeadBar } from "@/components";

export default () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <HeadBar hiddenLeft/>
      <div>Settings</div>
    </div>
  );
};
