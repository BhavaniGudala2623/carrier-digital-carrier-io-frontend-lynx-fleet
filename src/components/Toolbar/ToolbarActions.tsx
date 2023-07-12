import Button from '@carrier-io/fds-react/Button';

import { ShowOnPath } from '@/components/Toolbar/ShowOnPath';
import { ToolbarAction, useApplicationContext } from '@/providers/ApplicationContext';

export const ToolbarActions = () => {
  const {
    applicationState: {
      toolbarSettings: { actionsPath, actions },
    },
  } = useApplicationContext();

  if (!actionsPath || !actions?.length) {
    return null;
  }

  const renderAction = (action: ToolbarAction, idx: number) => {
    switch (action.type) {
      case 'BUTTON':
        return (
          <Button key={`action-${idx}`} variant="contained" sx={{ ml: 1 }} {...action.props}>
            {action.title}
          </Button>
        );

      case 'CUSTOM':
        return action.control;

      default:
        return null;
    }
  };

  return (
    <ShowOnPath path={actionsPath}>{actions.map((action, idx) => renderAction(action, idx))}</ShowOnPath>
  );
};
