'use client';
import DatePicker from "react-datepicker";
import styles from '@/styles/datepicker.module.css';

export default function MenuItem(props) {
  const date = props.date;
  const setDate = props.setDate;
  const maxDate = props.maxDate;
  const includeDates = props.includeDates;
  const DATE_FORMAT = "yyyy-MM-dd";

  return (
    <DatePicker
      dateFormat={DATE_FORMAT}
      wrapperClassName={styles.datePicker}
      selected={date}
      maxDate={maxDate}
      required={true}
      onChange={setDate}
      includeDates={includeDates ? includeDates.map(date => new Date(date)) : []}
    />
  )
}