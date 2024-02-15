import classNames from 'classnames';

import { REACTIONS } from '@/shared/constants';

interface ReactionProps {
  className?: string;
  onClick?: (value: number) => void;
}

const Reaction = (props: ReactionProps) => {
  const { className, onClick } = props;

  const handleReact = (reactValue: number) => {
    onClick && onClick(reactValue);
  };

  return (
    <div className={classNames("flex items-center space-x-2 bg-white border border-gray2 px-3 py-1 rounded-full z-10", className)}>
      {
        Object.values(REACTIONS).map((item) => 
          <span
            key={item.value}
            className="text-2xl cursor-pointer hover:scale-125 duration-300"
            onClick={() => handleReact(item.value)}
          >
            {item.text}
          </span>
        )
      }
    </div>
  );
};

export default Reaction;
