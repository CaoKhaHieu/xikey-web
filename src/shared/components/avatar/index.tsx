import classNames from "classnames";
import CameraIcon from "@/assets/icons/camera2.svg?react";

interface IAvatar {
  className: string;
  url: string;
  isUpload?: boolean;
  onClick?: () => void;
}

const Avatar = (props: IAvatar) => {
  const { className, url, isUpload, onClick } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative" onClick={handleClick}>
      <div
        className={classNames(
          "w-12 h-12 rounded-full border border-white overflow-hidden",
          className
        )}
      >
        <img src={url} />
      </div>
      {
        isUpload &&
        <div className="absolute bottom-0.5 right-1 text-xl bg-white w-4 h-4 rounded-full overflow-hidden flex items-center justify-center">
          <CameraIcon />
        </div>
      }
    </div>
  );
};

export default Avatar;
