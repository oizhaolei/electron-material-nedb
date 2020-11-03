import React, { useState } from 'react';
import log from 'electron-log';
import { useTranslation } from 'react-i18next';
import { ipcRenderer } from 'electron';

import { makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DropzoneArea } from 'material-ui-dropzone';
import MaterialTable from 'material-table';
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { mongo2Material } from '../../utils/utils';

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto',
  },
}));

const CustomList = ({ title, items }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <List
        dense
        component="div"
        role="list"
        subheader={<ListSubheader>{title}</ListSubheader>}
      >
        {items.map((item) => (
          <ListItem key={item} role="listitem" button>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

const CompareList = ({ left, right, leftTitle, rightTitle }) => (
  <Grid container spacing={6} justify="center" alignItems="center">
    <Grid item>
      <CustomList title={leftTitle} items={left} />
    </Grid>
    <Grid item>
      <CustomList title={rightTitle} items={right} />
    </Grid>
  </Grid>
);

const CSVDataTable = ({ columns, data }) => {
  return (
    <MaterialTable
      options={{
        search: false,
      }}
      title="Data"
      columns={columns}
      data={data}
    />
  );
};

export default function ImportTable({ dispatch, dataState }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [cleanData, setCleanData] = useState(false);
  const [data, setData] = useState([]);
  const [definition, setDefinition] = useState([]);
  // snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <div className={classes.root}>
      <Typography variant="body2" gutterBottom>
        {t('ImportTable demo')}
      </Typography>
      {loading && <CircularProgress />}
      <FormControlLabel
        control={
          <Checkbox
            checked={cleanData}
            onChange={() => setCleanData(!cleanData)}
            name="checkedB"
            color="primary"
          />
        }
        label="既存データを全部消して後、データをインポートする"
      />
      <DropzoneArea
        acceptedFiles={['text/csv']}
        dropzoneText={t('Drag and drop an CSV here or click')}
        onChange={(files) => {
          if (files && files.length > 0) {
            setLoading(true);
            ipcRenderer
              .invoke('csv-read', files[0].path)
              .then(({ definition, data }) => {
                setLoading(false);
                setDefinition(definition);
                setData(data);
                setError('');
              })
              .catch((e) => {
                setError(e.toString());
              });
          }
        }}
      />

      {definition && Object.keys(definition).length > 0 && (
        <>
          <Typography variant="caption" display="block" gutterBottom>
            列の比較
          </Typography>
          <CompareList
            left={Object.keys(dataState.definition)}
            right={Object.keys(definition)}
            leftTitle="既存テーブル"
            rightTitle="CSVファイル"
          />
        </>
      )}
      {definition &&
        Object.keys(definition).length > 0 &&
        data &&
        data.length > 0 && (
          <CSVDataTable columns={mongo2Material({ definition })} data={data} />
        )}

      {data.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
          onClick={() =>
            ipcRenderer
              .invoke('insert-many', {
                name: dataState.name,
                docs: data,
                cleanData,
              })
              .then((results) => {
                setSnackbarOpen(true);
              })
              .catch((e) => {
                alert(e.toString());
              })
          }
        >
          {t('Import')}
        </Button>
      )}
      <Typography color="error" variant="body1" gutterBottom>
        {error}
      </Typography>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {t('Imported')}
        </Alert>
      </Snackbar>
    </div>
  );
}
