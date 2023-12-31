import React, { useState } from 'react';
import { Box, useTheme, Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { withFormik } from 'formik';
import { getUserDetails } from '../../../utils/helpers/storageHelper';
import { useTranslation } from 'react-i18next';
import KenLoader from '../../../components/KenLoader';
import context from '../../../utils/helpers/context';
// import { KEY_USER } from '../../../../utils/constants';
import { postDashboardCases } from '../../../utils/ApiService';
import CaseForm from './CaseForm/index';

export default function DashboardCases(props) {
  return (
    <div>
      <FormikHoc {...props} />
    </div>
  );
}
const DashboardCasesDetails = props => {
  const theme = useTheme();
  const {
    values,
    touched,
    errors,
    handleChange,
    setFieldTouched,
    setFieldValue,
    handleSubmit,
    handleBack,
    cancelItem,
    submitForm,
    selectedCase,
    serviceType,
  } = props;

  const { handleSnackbarOpen } = React.useContext(context);
  console.log('test', props);
  return (
    <Box mt={2}>
      <CaseForm
        {...props}
        submitForm={handleSubmit}
        cancelItem={cancelItem}
      />
    </Box>
  );
};
const FormikHoc = props => {
  const {handleSubmit:onSubmit} = props;
  const [loading, setLoading] = React.useState(false);
  const { t } = useTranslation();
  const profile = getUserDetails().ContactId;
  const [formData, setFormData] = React.useState({});

  const DashboardCasesSchema = Yup.object().shape({
    // SubType: Yup.string().required(t('Validations:Required')),
    Subject: Yup.string().required(t('Validations:Required')),
    Description: Yup.string().required(t('Validations:Required')),
  });
  const FormikForm = withFormik({
    mapPropsToValues: () => ({
      SubType: '',
      Subject: '',
      Description: '',
      formData: formData,
      setFormData: setFormData,
    }),
    validationSchema: DashboardCasesSchema,
    handleSubmit: values => {
      setLoading(true);
      let payload = {
        hed__Category__c: props.serviceType,
        ContactId: profile,
        Status: 'New',
        Origin: 'Faculty Portal',
        Type: props.selectedCase,
        RecordTypeId: '0121s000000CzUSAA0',
        Priority: 'Medium',
        Subject: values.Subject,
        Description: values.Description,
      };
      postDashboardCases(payload)
        .then(res => {
          console.log(res);
          onSubmit();
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });

      setLoading(false);
    },
    setFormData: setFormData,
    formData: formData,
  })(DashboardCasesDetails);
  return <FormikForm {...props} />;
};
