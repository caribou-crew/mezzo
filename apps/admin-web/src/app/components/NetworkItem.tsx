import { TableCell, TableRow } from '@mui/material';

import { RecordedItem } from '@caribou-crew/mezzo-interfaces';
import { Cancel, Warning, CheckBox, ChangeCircle } from '@mui/icons-material';
import useWindowDimensions from '../hooks/useWindowDimensions';

interface Props extends RecordedItem {
  onClick: any;
}

const NetworkItem = ({
  uuid,
  url,
  request,
  response,
  date,
  deltaTime,
  duration,
  onClick,
}: Props) => {
  const { width } = useWindowDimensions();
  const host = new URL(url ?? '').origin;
  const path = new URL(url ?? '').pathname;
  const time = new Date(date).getTime();

  const getStatusSymbol = (status: any) => {
    let icon = <ChangeCircle />;
    const statusDigit = Math.floor(status / 100);

    switch (statusDigit) {
      case 2:
        icon = <CheckBox color="success" />;
        break;
      case 5:
        icon = <Cancel color="error" />;
        break;
      case 4:
        icon = <Warning color="warning" />;
        break;
      default:
        icon = <ChangeCircle color="primary" />;
        break;
    }

    return icon;
  };
  return (
    <TableRow
      key={uuid}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      onClick={onClick}
    >
      <TableCell padding="checkbox" component="th" scope="row">
        {getStatusSymbol(response?.status)}
      </TableCell>
      <TableCell padding="checkbox" component="th" scope="row">
        {response?.status}
      </TableCell>
      <TableCell padding="checkbox" align="left">
        {request.method}
      </TableCell>
      <TableCell padding="normal" align="left">
        {host}
      </TableCell>
      <TableCell padding="normal" align="left">
        {path}
      </TableCell>
      {width >= 1024 && (
        <>
          <TableCell padding="normal" align="right">
            {time} ms
          </TableCell>
          <TableCell padding="normal" align="right">
            {deltaTime} ms
          </TableCell>
          <TableCell padding="checkbox" align="right">
            {duration.toFixed(2)}
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

export default NetworkItem;
