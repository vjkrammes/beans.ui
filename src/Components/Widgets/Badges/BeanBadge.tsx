import {IBeanModel} from '../../../Interfaces/IBeanModel';
import './BeanBadge.css';

type Props = {
  bean: IBeanModel;
  height?: string | undefined;
  content?: JSX.Element | string | undefined;
};

export default function BeanBadge({bean, content, height}: Props) {
  return (
    <div className="bbdg__container">
      {bean && (
        <>
          <img
            src={`/images/${bean.filename}`}
            className="bbdg__image"
            alt=""
            style={{height: height}}
          />
          <div className="bbdg__name">{bean.name}</div>
          {content && <div className="bbdg__content">{content}</div>}
        </>
      )}
    </div>
  );
}
