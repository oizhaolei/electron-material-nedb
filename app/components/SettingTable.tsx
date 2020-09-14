import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';

import SearchIcons from './SearchIcons';

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 800,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    alignItems: 'center',
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}));

export default function ImportTable({ table }) {
  const classes = useStyles();

  const [tableName, setTableName] = useState(table);
  const [tableTitle, setTableTitle] = useState(table);
  const [open, setOpen] = useState(false);
  const [tableIcon, setTableIcon] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Paper className={classes.paper} levation={0}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="table"
            name="table"
            label="Table Name"
            fullWidth
            value={tableName}
            onChange={(event) => setTableName(event.target.value)}
            onBlur={console.log}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="title"
            name="title"
            label="Table Title"
            fullWidth
            value={tableTitle}
            onChange={(event) => setTableTitle(event.target.value)}
            onBlur={console.log}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={handleClickOpen}
            startIcon={<Icon>{tableIcon || 'ac_unit'}</Icon>}
          >
            Change Icon...
          </Button>
        </Grid>
      </Grid>

      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Fill the form</DialogTitle>
        <DialogContent>
          <SearchIcons onChange={setTableIcon} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
