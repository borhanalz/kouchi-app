'use client'

import {Chat} from "src/components/chat";

import {DashboardContent} from "../../layouts/dashboard";
// -------------------------------------------------------------------------------------------
const CreateTicket = () => {

  return (
    <DashboardContent
      maxWidth={false}
      sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}
      title="تیکت جدید"
    >
     <Chat isTicket/>
    </DashboardContent>
  );
};
export default CreateTicket;
