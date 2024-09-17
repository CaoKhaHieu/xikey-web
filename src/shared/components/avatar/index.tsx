import classNames from "classnames";

interface IAvatar {
  className: string;
  url: string;
  online?: boolean;
  onClick?: () => void;
}

const Avatar = (props: IAvatar) => {
  const { className, url, online, onClick } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative" onClick={handleClick}>
      <div
        className={classNames(
          "w-12 h-12 rounded-full overflow-hidden",
          className
        )}
      >
        <img src={url} />
      </div>

      {
        online &&
        <div className="absolute top-[70%] -right-1 w-4 h-4 rounded-full bg-green1 border-2 border-white">
        </div>
      }
    </div>
  );
};

export default Avatar;
