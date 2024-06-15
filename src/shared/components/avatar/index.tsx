import classNames from "classnames";

interface IAvatar {
  className: string;
  url: string;
  onClick?: () => void;
}

const Avatar = (props: IAvatar) => {
  const { className, url, onClick } = props;

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
    </div>
  );
};

export default Avatar;
