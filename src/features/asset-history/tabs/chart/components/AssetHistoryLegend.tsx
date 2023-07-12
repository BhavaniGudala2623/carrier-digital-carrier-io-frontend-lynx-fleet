import { useState, useEffect, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
  ExpandMore,
  ChevronRight,
  VisibilityOutlined,
  VisibilityOffOutlined,
  FiberManualRecord,
} from '@mui/icons-material';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import TreeItem from '@carrier-io/fds-react/TreeItem';
import TreeView from '@carrier-io/fds-react/TreeView';
import ListItem from '@carrier-io/fds-react/ListItem';
import List from '@carrier-io/fds-react/List';
import ListItemText from '@carrier-io/fds-react/ListItemText';
import ListItemSecondaryAction from '@carrier-io/fds-react/ListItemSecondaryAction';
import IconButton from '@carrier-io/fds-react/IconButton';
import ListItemIcon from '@carrier-io/fds-react/ListItemIcon';
import Box from '@carrier-io/fds-react/Box';
import { colors } from '@mui/material';

import { IColumnsToDisplay } from '../../../types';

import { ILegendSettings } from '@/providers/ApplicationContext';
import { ChartConfig } from '@/types';

const { blue } = colors;

interface IAssetHistoryLegend {
  chartConfig?: ChartConfig;
  defaultColumnsToDisplay?: IColumnsToDisplay;
  setLegendSettings: (settings: ILegendSettings) => void;
  setSelectedView: (view: Maybe<number | string>) => void;
}

const AssetHistoryLegend = (props: IAssetHistoryLegend) => {
  const { chartConfig, defaultColumnsToDisplay, setLegendSettings, setSelectedView } = props;

  const { t } = useTranslation();

  const [columnsToDisplay, setColumnsToDisplay] = useState<string[]>(defaultColumnsToDisplay || []);
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    const newColumnsToDisplay = defaultColumnsToDisplay ? [...defaultColumnsToDisplay] : [];

    if (chartConfig && defaultColumnsToDisplay) {
      Object.keys(chartConfig).forEach((key) => {
        if (
          chartConfig[key].children &&
          Object.keys(chartConfig[key].children).find((c) => defaultColumnsToDisplay?.includes(c))
        ) {
          if (!newColumnsToDisplay.includes(key)) {
            newColumnsToDisplay.push(key);
          }
        }
      });
    }
    setColumnsToDisplay(newColumnsToDisplay);
  }, [defaultColumnsToDisplay, chartConfig, setLegendSettings]);

  useEffect(() => {
    setLegendSettings({
      columnsToDisplay,
    });
    setExpanded(columnsToDisplay);
  }, [columnsToDisplay, setLegendSettings]);

  const handleChecked = (param: string) => {
    setColumnsToDisplay((oldColumnsToDisplay) => {
      let newColumnsToDisplay: IColumnsToDisplay;

      if (oldColumnsToDisplay?.includes(param)) {
        newColumnsToDisplay = oldColumnsToDisplay.filter((c) => c !== param);

        if (chartConfig?.[param] && chartConfig[param].children) {
          Object.keys(chartConfig[param].children)
            .filter((c) => chartConfig[param].children[c].available)
            .forEach((child) => {
              if (newColumnsToDisplay?.includes(child)) {
                newColumnsToDisplay = newColumnsToDisplay.filter((c) => c !== child);
              }
            });
        }
      } else {
        newColumnsToDisplay = [...oldColumnsToDisplay, param];

        if (chartConfig?.[param] && chartConfig[param].children) {
          Object.keys(chartConfig[param].children)
            .filter((c) => chartConfig[param].children[c].available)
            .forEach((child) => {
              if (newColumnsToDisplay && !newColumnsToDisplay?.includes(child)) {
                newColumnsToDisplay.push(child);
              }
            });
        }
      }

      if (chartConfig) {
        Object.keys(chartConfig)
          .filter((c) => !chartConfig[c].rootNode)
          .forEach((nodeKey) => {
            const node = chartConfig[nodeKey];

            if (node.children) {
              let display = false;

              Object.keys(node.children).forEach((child) => {
                if (newColumnsToDisplay?.includes(child)) {
                  display = true;
                }
              });

              if (!display) {
                newColumnsToDisplay = newColumnsToDisplay?.filter((c) => c !== nodeKey);
              } else if (newColumnsToDisplay?.includes && newColumnsToDisplay.includes(nodeKey)) {
                if (!newColumnsToDisplay.includes(nodeKey)) {
                  newColumnsToDisplay.push(nodeKey);
                }
              }
            }
          });
      }

      return newColumnsToDisplay;
    });
    setSelectedView(null);
  };

  const onNodeExpand = (_event: ChangeEvent<{}>, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  function getIcon(color = '#000000', type = 'solid') {
    if (type === 'dashed') {
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="8" width="4" height="2" rx="1" fill={color} />
          <rect x="7" y="8" width="4" height="2" rx="1" fill={color} />
          <rect x="14" y="8" width="4" height="2" rx="1" fill={color} />
        </svg>
      );
    }

    if (type === 'dotted') {
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="8" width="2" height="2" rx="1" fill={color} />
          <rect x="4" y="8" width="2" height="2" rx="1" fill={color} />
          <rect x="8" y="8" width="2" height="2" rx="1" fill={color} />
          <rect x="12" y="8" width="2" height="2" rx="1" fill={color} />
          <rect x="16" y="8" width="2" height="2" rx="1" fill={color} />
        </svg>
      );
    }

    if (type === 'solid') {
      return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="8" width="18" height="2" rx="1" fill={color} />
        </svg>
      );
    }

    return '-';
  }

  function getNodeChildren(node: ChartConfig[keyof ChartConfig], trans: TFunction) {
    return Object.keys(node.children).map((childKey, index) => {
      const child = node.children[childKey];
      const hidden = columnsToDisplay.includes && !columnsToDisplay.includes(childKey as never);
      const labelId = `list-label-${childKey}-${index}`;

      return (
        child?.available && (
          <ListItem
            key={childKey}
            role={undefined}
            dense
            disabled={hidden}
            sx={{
              '&:hover .MuiListItemSecondaryAction-root': {
                visibility: 'visible',
              },
            }}
          >
            <ListItemIcon style={{ minWidth: '26px' }}>{getIcon(child.color, child.lineType)}</ListItemIcon>
            <ListItemText
              sx={{ userSelect: 'none' }}
              id={labelId}
              primaryTypographyProps={{
                pr: '20px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              primary={child.i18nKey ? trans(child.i18nKey) : child.label}
            />
            <ListItemSecondaryAction
              sx={{
                visibility: 'hidden',
              }}
            >
              <IconButton
                edge="end"
                aria-label="toggle visibility"
                disableRipple
                onClick={() => handleChecked(childKey)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                {!hidden && <VisibilityOutlined fontSize="small" />}
                {hidden && <VisibilityOffOutlined fontSize="small" />}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )
      );
    });
  }

  function getTreeForNode(node: ChartConfig[keyof ChartConfig], key: string, trans: TFunction) {
    if (!node.available) {
      return '';
    }

    const { rootNode } = node;
    const hidden = columnsToDisplay.includes && !columnsToDisplay.includes(key as never);
    /*
      A null icon is the default < symbol that appears for the tree node label
       */
    const icon = rootNode ? <FiberManualRecord style={{ color: blue[800] }} /> : null;

    return (
      <TreeItem
        icon={icon}
        key={`treeItem-${key}`}
        nodeId={key}
        sx={{
          '.MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
            backgroundColor: 'transparent',
          },
          '.MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover, .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label':
            {
              backgroundColor: 'transparent',
            },
        }}
        label={
          <List
            sx={{
              py: 0,
              userSelect: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&:focus': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <ListItem
              key={`listItem-${key}`}
              role={undefined}
              dense
              disabled={hidden}
              sx={{
                px: 0,
                '&:hover .MuiListItemSecondaryAction-root': {
                  visibility: 'visible',
                },
              }}
            >
              <ListItemText
                id={`listItemText-${key}`}
                sx={{ userSelect: 'none' }}
                primary={`${node.i18nKey ? trans(node.i18nKey) : node.label}`}
              />
              <ListItemSecondaryAction
                sx={{
                  visibility: 'hidden',
                }}
              >
                <IconButton
                  edge="end"
                  aria-label="toggle visibility"
                  disableRipple
                  onClick={() => handleChecked(key)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {!hidden && <VisibilityOutlined fontSize="small" />}
                  {hidden && <VisibilityOffOutlined fontSize="small" />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        }
      >
        <List sx={{ py: 0 }}>{getNodeChildren(node, t)}</List>
      </TreeItem>
    );
  }

  if (!chartConfig) {
    return null;
  }

  return (
    <Box
      sx={{
        width: '209px',
        height: '390px',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        expanded={expanded}
        onNodeToggle={onNodeExpand}
      >
        {Object.keys(chartConfig).map((key) => getTreeForNode(chartConfig[key], key, t))}
      </TreeView>
    </Box>
  );
};

export { AssetHistoryLegend };
