import {TabLayout} from "../../../../sections/profile/tab-layout";
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  profile:React.ReactNode;
};

export default function Layout({profile}:Props) {
  return (
    <TabLayout>{profile}</TabLayout>
  );
}
