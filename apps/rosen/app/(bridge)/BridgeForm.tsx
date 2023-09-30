'use client';
import { useCallback, ChangeEvent } from 'react';
import Image from 'next/image';
import { countDecimals } from '@rosen-ui/utils';

import {
  alpha,
  Grid,
  TextField,
  Typography,
  ListItemIcon,
  styled,
  MenuItem,
  Button,
} from '@rosen-bridge/ui-kit';

import useBridgeForm from '@/_hooks/useBridgeForm';
import useNetwork from '@/_hooks/useNetwork';

import { getTokenNameAndId } from '@/_utils';
import useTokenBalance from '@/_hooks/useTokenBalance';

/**
 * customized form input
 */
const FormInputs = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.input,
    minHeight: theme.spacing(8.5),

    transition: theme.transitions.create(['background-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: theme.palette.background.header,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.header,
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
    },
  },
}));

/**
 * max button component container for amount field
 */
const MaxButton = styled(Button)(({ theme }) => ({
  padding: 0,
  fontSize: theme.spacing(1.5),
}));

/**
 * bridge form container comp
 */
const SelectedAsset = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  margin: theme.spacing(0.5),
}));

/**
 * bridge form container comp
 */
const FormContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
}));

/**
 * renders the bridge main form
 */
const BridgeForm = () => {
  const {
    reset,
    setValue,
    resetField,
    sourceField,
    targetField,
    tokenField,
    amountField,
    addressField,
    formState: { errors },
  } = useBridgeForm();

  const { availableNetworks, tokens, targetNetworks } = useNetwork();
  const { isLoading, amount } = useTokenBalance();

  const renderSelectedAsset = (value: unknown) => {
    const network = availableNetworks.find(
      (network) => network.name === value,
    )!;
    return (
      <SelectedAsset>
        <Image src={network.logo} width={24} height={24} alt="network logo" />
        <Typography variant="button" color="text.secondary">
          {network.label}
        </Typography>
      </SelectedAsset>
    );
  };

  const handleTokenChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const currentToken = tokens.find(
        (token) =>
          getTokenNameAndId(token, sourceField.value)?.tokenId ===
          e.target.value,
      );
      setValue('token', currentToken, {
        shouldDirty: true,
        shouldTouch: true,
      });
      setValue('amount', '');
      resetField('amount');
    },
    [setValue, resetField, tokens, sourceField],
  );

  const handleSourceSChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value !== sourceField.value) {
        reset({
          target: null,
          token: null,
          amount: '',
          walletAddress: '',
          source: e.target.value,
        });
      }
    },
    [reset, sourceField],
  );

  const handleTargeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value !== targetField.value) {
        reset({
          source: sourceField.value,
          target: e.target.value,
          token: null,
          amount: '',
          walletAddress: '',
        });
      }
    },
    [reset, sourceField, targetField],
  );

  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (countDecimals(e.target.value) <= tokenField.value?.decimals) {
        amountField.onChange(e);
      }
    },
    [amountField, tokenField],
  );

  return (
    <FormContainer>
      <Grid container spacing={1}>
        <Grid item mobile={6}>
          <FormInputs
            id="source"
            select
            label="Source"
            inputProps={{ 'aria-label': 'Without label' }}
            InputProps={{ disableUnderline: true }}
            variant="filled"
            {...sourceField}
            SelectProps={{
              renderValue: renderSelectedAsset,
            }}
            onChange={handleSourceSChange}
          >
            {availableNetworks.map((network) => (
              <MenuItem key={network.name} value={network.name}>
                <ListItemIcon>
                  <Image
                    src={network.logo}
                    width={24}
                    height={24}
                    alt="network logo"
                  />
                </ListItemIcon>
                <Typography variant="body2" color="text.secondary">
                  {network.label}
                </Typography>
              </MenuItem>
            ))}
          </FormInputs>
        </Grid>
        <Grid item mobile={6}>
          <FormInputs
            id="target"
            select
            label="Target"
            disabled={!sourceField.value}
            InputProps={{ disableUnderline: true }}
            variant="filled"
            {...targetField}
            SelectProps={{
              renderValue: renderSelectedAsset,
            }}
            onChange={handleTargeChange}
          >
            {targetNetworks.map((network) => (
              <MenuItem key={network.name} value={network.name}>
                <ListItemIcon>
                  <Image
                    src={network.logo}
                    width={24}
                    height={24}
                    alt="network logo"
                  />
                </ListItemIcon>
                <Typography variant="body2" color="text.secondary">
                  {network.label}
                </Typography>
              </MenuItem>
            ))}
          </FormInputs>
        </Grid>
      </Grid>
      <FormInputs
        id="token"
        select
        label="TOKEN"
        disabled={!tokens.length}
        InputProps={{ disableUnderline: true }}
        variant="filled"
        {...tokenField}
        value={
          tokenField.value
            ? getTokenNameAndId(tokenField.value, sourceField.value)?.tokenId
            : ''
        }
        onChange={handleTokenChange}
      >
        {tokens.map((token) => {
          const { tokenId, tokenName } = getTokenNameAndId(
            token,
            sourceField.value,
          )!;
          return (
            <MenuItem key={tokenId} value={tokenId}>
              {tokenName}
            </MenuItem>
          );
        })}
      </FormInputs>
      <FormInputs
        type="number"
        id="amount"
        size="medium"
        label="Amount"
        placeholder="0.0"
        helperText={
          tokenField.value ? (
            <Grid container justifyContent="space-between">
              <Typography color="primary" variant="caption">
                {' '}
                {`Balance: ${isLoading ? 'loading...' : amount}`}
              </Typography>
              <MaxButton
                disabled={isLoading}
                onClick={() => {
                  setValue('amount', amount, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              >
                MAX
              </MaxButton>
            </Grid>
          ) : (
            ''
          )
        }
        InputProps={{ disableUnderline: true }}
        inputProps={{
          style: { fontSize: '2rem' },
        }}
        variant="filled"
        {...amountField}
        onChange={handleAmountChange}
        disabled={!tokenField.value}
      />
      <FormInputs
        label="Address"
        InputProps={{ disableUnderline: true } as any}
        variant="filled"
        error={!!errors?.walletAddress}
        helperText={errors.walletAddress?.message?.toString()}
        {...addressField}
      />
    </FormContainer>
  );
};

export default BridgeForm;