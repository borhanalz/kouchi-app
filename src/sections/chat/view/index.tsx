import Typography from "@mui/material/Typography";

import {DashboardContent} from "src/layouts/dashboard";

import {Chat} from "src/components/chat";

// --------------------------------------------------------------------------------

const ChatView = () => (
  <DashboardContent
  maxWidth={false}
  sx={{display: 'flex', flex: '1 1 auto', flexDirection: 'column'}}
  title='گفت و گو با کوچی'
>
  <Chat/>
</DashboardContent>
)
export default ChatView;
