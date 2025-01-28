import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

import {Iconify} from "../components/iconify";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <Iconify icon={name as string} />
);

const ICONS = {
  send:icon('send'),
  map:icon('map'),
  documentsList:icon('files'),
  businessManagement:icon('building'),
  calender:icon('calender'),
  files:icon('file'),
  tickets: icon('messages'),
  userInfo: icon('userInfo')

};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    items: [
      {
        title: 'گفت و گو با کوچی',
        path: '',
        icon: ICONS.send,
        info: <Label>دستیار</Label>,
      },
      {
        title: 'نقشه راه',
        path: '',
        icon: ICONS.map,
      },
      {
        title: 'لیست مدارک',
        path: '',
        icon: ICONS.documentsList,
      },
      {
        title: 'مدیریت کارها',
        path: '',
        icon: ICONS.businessManagement,
      },
      {
        title: 'تقویم',
        path: '',
        icon: ICONS.calender,
      },
      {
        title: 'فایل ها',
        path: '',
        icon: ICONS.files,
      },
      {
        title: 'تیکت ها',
        path: '',
        icon: ICONS.tickets,
      },
      {
        title: 'اطلاعات کاربری',
        path: '',
        icon: ICONS.userInfo,
      },
      // { title: 'Two', path: paths.app.two, icon: ICONS.ecommerce },
      // { title: 'Three', path: paths.app.three, icon: ICONS.analytics },
    ],
  },
  /**
   * Management
   */
  // {
  //   subheader: 'Management',
  //   items: [
  //     {
  //       title: 'Group',
  //       path: paths.app.group.root,
  //       icon: ICONS.user,
  //       children: [
  //         { title: 'Four', path: paths.app.group.root },
  //         { title: 'Five', path: paths.app.group.five },
  //         { title: 'Six', path: paths.app.group.six },
  //       ],
  //     },
  //   ],
  // },
];
