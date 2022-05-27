import { TableCell, TableRow } from '@mui/material';

import { RecordedItem } from '@caribou-crew/mezzo-interfaces';

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
  return (
    <TableRow
      key={uuid}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      onClick={onClick}
    >
      <TableCell component="th" scope="row">
        {response?.status}
      </TableCell>
      <TableCell align="left">{request.method}</TableCell>
      <TableCell align="left">{url}</TableCell>
      <TableCell align="right">{new Date(date).toISOString()}</TableCell>
      <TableCell align="right">{deltaTime}</TableCell>
      <TableCell align="right">{duration.toFixed(2)}</TableCell>
    </TableRow>
  );
};

export default NetworkItem;
