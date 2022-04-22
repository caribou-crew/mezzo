/**
 * When using `import { Icon } from @mui/material` ...
 * `<Icon>star</Icon>` works
 * `<Icon>github</Icon>` did NOT work
 * `import GitHubIcon from '@mui/icons-material/GitHub';` did work despite it existing https://mui.com/material-ui/material-icons/?query=github
 *
 * In order to have more options I followed the general outline of this SO answer https://stackoverflow.com/a/66828783/1759504
 * After doing so I can somewhat dynamically import icons, e.g. github icon now works
 *
 * Downside may be final build size, more investigation is required to confirm
 * Build size impact of importing all icons and these new dependencies is is about 0.3MB
 */
import * as allIcons from '@mui/icons-material';
import stringSimilarity from 'string-similarity';
import memoizee from 'memoizee';
import { RouteOrVariantIcon } from '@caribou-crew/mezzo-interfaces';

interface Props extends RouteOrVariantIcon {
  style?: any;
}

function GetIcon(props: Props) {
  const iconsNames = Object.keys(allIcons);
  const matches = stringSimilarity.findBestMatch(props.name, iconsNames);
  const bestMatch = matches.bestMatch.target;
  if (bestMatch) {
    const myIcons: any = allIcons;
    const Icon = myIcons[bestMatch];
    return <Icon style={props.style} color={props.color} />;
  } else {
    return null;
  }
}

export default memoizee(GetIcon);
