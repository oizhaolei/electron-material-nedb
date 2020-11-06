import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { useTranslation } from 'react-i18next';
import pluralize from 'pluralize';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default function NameForm({ dataState, dispatch }) {
  const { t } = useTranslation();

  const [name, setName] = useState(dataState.name);
  const [memo, setMemo] = useState(dataState.memo);
  const [schemaNames, setSchemaNames] = useState([]);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    ipcRenderer.invoke('schemas').then((ss) => {
      setSchemaNames(ss.map((s) => pluralize(s.name.toLowerCase())));
    });
  }, []);

  const handleNameChange = (v) => {
    setName(v);

    const plural = pluralize(v.toLowerCase());
    let err = '';
    if (!/^[A-Za-z0-9]{1,15}$/.test(plural)) {
      err = '最大１５桁英数';
    } else if (schemaNames.includes(plural)) {
      err = '名前が既存と重複';
    }

    setHelperText(err);
    dispatch({
      type: 'SCHEMA_WIZARD_INIT',
      payload: {
        name: plural,
        error: !!err,
      },
    });
  };

  const handleMemoChange = (v) => {
    setMemo(v);
    dispatch({
      type: 'SCHEMA_WIZARD_INIT',
      payload: {
        memo: v,
      },
    });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {t('table name')}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {t('schema nameform demo')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            id="name"
            name="name"
            label={t('table name')}
            fullWidth
            autoComplete="input unique table please"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            error={!!helperText}
            helperText={helperText}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="memo"
            name="memo"
            label={t('memo')}
            fullWidth
            autoComplete="memo"
            value={memo}
            onChange={(event) => handleMemoChange(event.target.value)}
          />
        </Grid>
      </Grid>
    </>
  );
}
