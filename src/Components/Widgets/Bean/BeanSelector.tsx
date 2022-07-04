import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { IBeanModel } from '../../../Interfaces/IBeanModel';
import { getBeans } from '../../../Services/BeanService';
import './BeanSelector.css';

type Props = {
  beanChanged: (id: string) => void;
  title?: string;
  prefix?: boolean;
  initialValue?: string;
  selectWidth?: string;
};

export default function BeanSelector({
  beanChanged,
  title,
  prefix,
  initialValue,
  selectWidth,
}: Props) {
  const [beans, setBeans] = useState<IBeanModel[]>([]);
  const [selectedBean, setSelectedBean] = useState<IBeanModel | null>(null);
  const doGetBeans = useCallback(async () => {
    const b = await getBeans();
    setBeans(b);
  }, []);
  useEffect(() => {
    doGetBeans();
  }, [doGetBeans]);
  useEffect(() => {
    const iv = initialValue || '0';
    const b = beans.find((x) => x.id === iv);
    if (b) {
      setSelectedBean(b);
    }
  }, [beans, initialValue]);
  function thisBeanChanged(e: ChangeEvent<HTMLSelectElement>) {
    if (e && e.target && e.target.value) {
      const b = beans.find((x) => x.id === e.target.value);
      if (b) {
        setSelectedBean(b);
        beanChanged(b.id);
        return;
      }
    }
    beanChanged('0');
    setSelectedBean(null);
  }
  return (
    <div className="bswidget__container">
      {title && prefix && <div className="bswidget__title">{title}</div>}
      <select
        className="bswidget__select"
        value={selectedBean ? selectedBean.id : '0'}
        onChange={thisBeanChanged}
        style={selectWidth ? { width: selectWidth } : undefined}
      >
        <option key={'0'} value="0">
          All Beans
        </option>
        {beans &&
          beans.length > 0 &&
          beans.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
      </select>
      {title && !prefix && <div className="bswidget__title">{title}</div>}
    </div>
  );
}
