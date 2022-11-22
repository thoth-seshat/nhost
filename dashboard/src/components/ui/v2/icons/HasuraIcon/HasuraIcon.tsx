import type { IconProps } from '@/ui/v2/icons';
import SvgIcon from '@mui/material/SvgIcon';

function HasuraIcon(props: IconProps) {
  return (
    <SvgIcon
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      aria-label="Logo of Hasura"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.16.489c.572 1.65.572 3.806.134 4.867a2.466 2.466 0 0 0-.067 1.667c.22.657.337 1.348.337 2.089 0 3.688-2.981 6.636-6.653 6.568-3.486-.05-6.433-3.014-6.518-6.484a6.28 6.28 0 0 1 .337-2.19 2.322 2.322 0 0 0-.033-1.65c-.421-1.044-.438-3.2.134-4.884.135-.303.607-.202.607.118v.118c.1 1.6.707 2.56 1.583 2.88.135.067.303.05.438-.034 1.027-.623 2.223-1.01 3.52-1.01 1.297 0 2.51.37 3.52 1.01.151.101.37.101.505.034.859-.421 1.431-1.28 1.533-2.864V.607c.016-.32.471-.421.623-.118Zm-6.08 3.62c-2.83-.067-5.154 2.258-5.087 5.104.034 2.678 2.24 4.85 4.901 4.918 2.847.034 5.154-2.274 5.104-5.103-.05-2.678-2.24-4.885-4.918-4.918Zm-.506 2.645 1.18 1.819 1.145 1.819a.608.608 0 0 1 .1.337.644.644 0 0 1-.302.539.665.665 0 0 1-.725-.017c-.084-.05-.151-.101-.185-.185l-.657-.944c-.05-.1-.168-.1-.252-.016l-.927 1.078a.636.636 0 0 1-.454.202.692.692 0 0 1-.438-.152.636.636 0 0 1-.034-.893l1.246-1.364c.05-.084.085-.202.017-.303l-.791-1.246a.607.607 0 0 1-.101-.337c0-.22.117-.421.303-.54a.63.63 0 0 1 .875.203Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

HasuraIcon.displayName = 'NhostHasuraIcon';

export default HasuraIcon;