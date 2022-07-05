import { CSSProperties } from 'react';
import './BeanNameBadge.css';

type Props = {
  name: string;
  filename: string;
  style?: CSSProperties;
};

export default function BeanNameBadge({ name, filename, style }: Props) {
  return (
    <div className="bnb__container">
      <img
        src={`/images/${filename}`}
        className="bnb__image"
        style={style ? style : undefined}
        alt=""
      />
      <div className="bnb__name">{name}</div>
    </div>
  );
}
