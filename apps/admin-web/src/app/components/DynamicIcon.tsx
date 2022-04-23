import { Icon } from '@mui/material';

type Props = {
  name: string;
  style?: any;
};

/**
 *
 * Only icons from https://fonts.google.com/icons?selected=Material+Icons are supported.
 * Note https://mui.com/material-ui/material-icons/ as some extras (not suppoted dynamically
 * via this step https://mui.com/material-ui/getting-started/installation/#font-icons)
 * @param props
 * @returns
 */
export default function DynamicIcon(props: Props) {
  const item = <Icon style={props.style}>{props.name}</Icon>;
  return item;
}
