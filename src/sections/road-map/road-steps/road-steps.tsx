'use client';

import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import {format} from "date-fns-jalali";
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import {faIR} from "date-fns-jalali/locale";
import { FC, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import italyImg from 'public/assets/images/ITALY.png';
import canadaImg from 'public/assets/images/canadaFlag.jpg';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import {
  Step,
  Stepper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { grey } from '../../../theme';
import { GetRequest } from '../../../lib/axios';
import { endpoints } from '../../../hooks/endPoints';
import { Iconify } from '../../../components/iconify';
import {IRoadmapResponse} from "../../../types/road-map";
//------------------------------------------------------------------------------
interface IRoadSteps {
  countryName: string;
}

//------------------------------------------------------------------------------
const RoadStepsView: FC<IRoadSteps> = ({ countryName }) => {
  const theme = useTheme();

  const { data, isPending } = useQuery<IRoadmapResponse>({
    queryKey: ['roads-list'],
    queryFn: () => GetRequest(endpoints.ROADMAP.LIST),
  });

  const roadmap = data?.data?.[0];

  if (isPending) {
    return <Typography>در حال بارگذاری...</Typography>;
  }

  if (!roadmap?.template?.steps?.length) {
    return <Typography>هیچ مرحله‌ای یافت نشد.</Typography>;
  }

  const markdownComponents = {
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <table
        {...props}
        style={{
          borderCollapse: 'collapse',
          width: '100%',
        }}
      />
    ),
    th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
      <th
        {...props}
        style={{
          border: '1px solid #ccc',
          padding: '8px',
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
        }}
      />
    ),
    td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
      <td
        {...props}
        style={{
          border: '1px solid #ccc',
          padding: '8px',
        }}
      />
    ),
  };

  console.log(data)
  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      title={roadmap.template?.name + ' ' + roadmap.template?.track as string}
    >
      <Stack mt={5}>
          {roadmap.template.steps.map((step, index) => (
            <Stack key={step._id} spacing={2}>
              <Accordion
                defaultExpanded={index === 0}
                sx={{
                  mb: 2,
                  background: theme.palette.background.paper,
                  border: `1px solid ${grey[300]}`,
                  borderRadius: 2,
                }}
              >
                <AccordionSummary expandIcon={<Iconify icon="arrowDown" />}>
                  <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Iconify
                        icon={index === 0 ? 'university' : 'DOCUMENT_PREPARATION'}
                        sx={{ width: 30, height: 30, color: theme.vars.palette.primary.main }}
                      />
                      <Typography fontWeight="bold" variant="h6" color={theme.vars.palette.secondary.main}>
                        {step?.title}
                      </Typography>
                    </Stack>
                    <Stack sx={{ borderRadius: 2, backgroundColor: theme?.palette?.primary?.main, py: 1, px: 2,mx:3 }}>
                      <Typography variant="caption" color="white">
                        {step?.timeRange?.description} :
                        {format(new Date(step?.timeRange?.start), 'd MMMM', { locale: faIR })}
                        {' تا '}
                        {format(new Date(step?.timeRange?.end), 'd MMMM', { locale: faIR })}
                      </Typography>
                    </Stack>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Stack spacing={1}>
                    <Typography fontWeight="bold">
                      {step?.description?.title}
                    </Typography>

                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {step?.description?.description}
                    </ReactMarkdown>

                    {step?.subSteps?.map((sub) => (
                      <Accordion
                        key={sub._id}
                        sx={{
                          mt: 2,
                          background: theme.palette.background.paper,
                          border: `1px solid ${grey[300]}`,
                          borderRadius: 2,
                        }}
                      >
                        <AccordionSummary expandIcon={<Iconify icon="arrowDown" />}>
                          <Typography fontWeight="bold" color={theme.vars.palette.primary.main}>
                            {sub.title}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Stack spacing={2}>
                            <Typography color="text.secondary">{sub.summary}</Typography>

                            <Typography variant="subtitle1">{sub.description?.title}</Typography>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                              {sub.description?.description ?? ''}
                            </ReactMarkdown>

                            <Divider />

                            {sub.requiredDocs?.docs?.length > 0 && (
                              <>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {sub.requiredDocs?.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {sub.requiredDocs?.description}
                                </Typography>
                                <ul style={{ margin: 0, paddingInlineStart: '20px' }}>
                                  {sub.requiredDocs.docs.map((doc) => (
                                    <li key={doc.title}>
                                      <Typography variant="body2" fontWeight="bold">
                                        {doc.title}
                                      </Typography>
                                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                        {doc.description ?? ''}
                                      </ReactMarkdown>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}

                            {sub.details?.steps?.map((d) => (
                              <Stack key={d.title}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {d.title}
                                </Typography>
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                  {d.description}
                                </ReactMarkdown>
                              </Stack>
                            ))}

                            {sub.costs?.length > 0 && (
                              <>
                                <Divider />
                                <Typography variant="subtitle2" fontWeight="bold">
                                  هزینه‌ها
                                </Typography>
                                {sub.costs.map((cost) => (
                                  <Stack key={cost.title}>
                                    <Typography variant="body2" fontWeight="bold">
                                      {cost.title}
                                    </Typography>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                      {`${cost?.description ?? ''} - ${cost?.amount?.toLocaleString?.() ?? ''} ${cost?.currency ?? ''}`}
                                    </ReactMarkdown>
                                  </Stack>
                                ))}
                              </>
                            )}

                            {sub.links?.length > 0 && (
                              <>
                                <Divider />
                                <Typography variant="subtitle2" fontWeight="bold">
                                  لینک‌های مفید
                                </Typography>
                                {sub.links.map((link) => (
                                  <a
                                    key={link.title}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: theme.palette.primary.main }}
                                  >
                                    <Typography variant="body2">{link.title}</Typography>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                      {link.description ?? ''}
                                    </ReactMarkdown>
                                  </a>
                                ))}
                              </>
                            )}
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          ))}
      </Stack>
    </DashboardContent>
  );
};

export default RoadStepsView;
