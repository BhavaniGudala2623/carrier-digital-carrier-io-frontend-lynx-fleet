import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import Typography from '@carrier-io/fds-react/Typography';
import Grid from '@carrier-io/fds-react/Grid';
import { Description, DescriptionVariants } from '@carrier-io/fds-react/patterns/Description';

import { useReviewData } from '../../hooks';

import { CreateCompanyFormData } from '@/features/company-management/types';

export const Review = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<CreateCompanyFormData>();
  const { companyInfo, preferences, featuresData } = useReviewData(values);

  return (
    <Grid container sx={{ pt: 3, pr: 0.5, pb: 2.5 }}>
      <Grid item xs={12} sx={{ backgroundColor: 'background.description', p: 2, borderRadius: 1 }}>
        <Typography marginBottom={1.25} variant="subtitle1">
          {t('company.management.company-information')}
        </Typography>
        <Description
          rowIndentCssUnit="rem"
          rowIndentValue={1.25}
          variant={DescriptionVariants.HorizontalJustifiedWithNoDots}
          sx={{ minHeight: 300, backgroundColor: 'background.description' }}
        >
          {companyInfo.map(({ label, text }) => (
            <Description.Item TextProps={{ textAlign: 'right' }} key={label} label={label}>
              {text}
            </Description.Item>
          ))}
        </Description>
      </Grid>
      <Grid item xs={12} container wrap="nowrap">
        <Grid
          item
          xs={6}
          sx={{
            backgroundColor: 'background.description',
            p: 2,
            mt: 1,
            mr: 1,
            borderRadius: 1,
          }}
        >
          <Typography marginBottom={1.25} variant="subtitle1">
            {t('company.management.company-preferences')}
          </Typography>
          <Description
            rowIndentCssUnit="rem"
            rowIndentValue={1.25}
            variant={DescriptionVariants.HorizontalJustifiedWithNoDots}
            sx={{ height: 240, backgroundColor: 'background.description' }}
          >
            {preferences.map(({ label, text }) => (
              <Description.Item TextProps={{ textAlign: 'right' }} key={label} label={label}>
                {text}
              </Description.Item>
            ))}
          </Description>
        </Grid>
        <Grid item xs={6} sx={{ backgroundColor: 'background.description', p: 2, mt: 1, borderRadius: 1 }}>
          <Typography marginBottom={1.25} variant="subtitle1">
            {t('company.management.feature-access')}
          </Typography>
          <Description
            rowIndentCssUnit="rem"
            rowIndentValue={1.25}
            variant={DescriptionVariants.HorizontalJustifiedWithNoDots}
            sx={{ minHeight: 415, backgroundColor: 'background.description' }}
          >
            {featuresData?.map(({ text, label }) => (
              <Description.Item TextProps={{ textAlign: 'right' }} key={label} label={label}>
                {text}
              </Description.Item>
            ))}
          </Description>
        </Grid>
      </Grid>
    </Grid>
  );
};

Review.displayName = 'Review';
