/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { Typography, TextField, Paper, Box, Grid, Avatar, Container, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { User } from '../../utils/dtos';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { server } from '../../index';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

interface UserAttribute {
  value : string;
  label: string;
  editable?: boolean;
}

function Profile() {
  const { user } = useContext(AppContext);
  const userInfo : User = user!;
  const today = new Date();
  const [joinedDate, setJoinedDate] = useState<Date>(today);
  useEffect(() => {
    (async function () {
      const response = await fetch(
        `${server}/api/users?index=userid&id=${user!.userId}`
      );
      const body = await response.json();
      setJoinedDate(new Date(body.data[0].joinedOn));
      // console.log(joinedDate);
    })();
  }, []);

  const userInitials = `${user!.firstName}`;
  const [content, setContent] = useState([
    {
      label: 'First Name',
      value: userInfo.firstName,
      editable: true
    },
    {
      label: 'Last Name',
      value: userInfo?.lastName,
      editable: true
    },
    {
      label: 'Email',
      value: userInfo?.email
    },
    {
      label: 'Phone',
      value: userInfo?.phone,
      editable: true
    },
  ]);
  const [editMode, setEditMode] = useState(false);
  const changeEditMode = () => {
    setEditMode(!editMode);
  };

  const saveData = () => {
    console.log(content);
    changeEditMode();
  };

  const handleInputChange = (event: any, field : any, index: number) => {
    // console.log(field);
    // console.log(event.target.value);
    const contentCopy = content;
    const newUserAttribute: UserAttribute = {
      label: field.label,
      value: event.target.value,
      editable: true
    };
    contentCopy.splice(index, 1, newUserAttribute);
    setContent(contentCopy);
    // console.log(`content = ${JSON.stringify(content)}`);
  };
  return (
      <Container maxWidth="md">
        <Box sx={{ mt: 10, }} >
          <Grid container wrap="nowrap" spacing={1}>
            <Grid item xs={2}>
              <Avatar alt={userInitials} src="/static/images/avatar/1.jpg" sx={{ width: 120, height: 120, fontSize: '50px' }} style={{ background: 'linear-gradient(to bottom right, #bcfb69, #26bbac)' }}/>
            </Grid>
            <Grid item xs={9} sx={{ mt: 1 }} justifyContent="center" alignItems="flex-start" >
              <Typography sx={{ fontFamily: 'Roboto', fontWeight: 500, fontSize: '30px', color: '#005B00',
              }} textTransform="uppercase">{user!.firstName} {user!.lastName}</Typography>
              <Typography fontStyle="italic" sx={{ fontFamily: 'Roboto', fontWeight: 300, fontSize: '18px', color: 'grey',
              }}>{user!.role?.charAt(0).toUpperCase()}{user!.role?.slice(1)} on BeMyGuest since {month[joinedDate.getMonth()]} {joinedDate.getFullYear()} </Typography>
              {
                (editMode) ?
                <Button startIcon={<SaveIcon />} size="medium" color="success" onClick={saveData}>
                  Save
                </Button>
                :
                <Button startIcon={<EditIcon />} size="medium" color="inherit" onClick={changeEditMode}>
                  Edit
                </Button>
              }
              
            </Grid>
          </Grid>
        </Box>
        {/* <Box sx={{ mt: 5, }} >
          {content.map((field, index) => (
            <Grid container spacing={2} key={index} sx={{mt: 5, ml: 2}}>
              <Grid item xs={3} >
                <Typography sx={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: '20px', color: 'grey',
                }}> {field.label} </Typography>
              </Grid>
              <Grid item xs={8} textAlign="center">
                <Typography sx={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '20px', color: 'grey',
                }}> {field.value} </Typography>
              </Grid>
            </Grid>
          ))}
        </Box> */}
        <Box sx={{ mt: 5, }} >
          {content.map((field, index) => (
            <Grid container spacing={2} key={index} sx={{mt: 5, ml: 2}}>
              <Grid item xs={4} >
                <Typography sx={{ fontFamily: 'Roboto', fontWeight: 400, fontSize: '20px', color: 'grey',
                }}> {field.label} </Typography>
              </Grid>
              <Grid item xs={7} textAlign="center">
                {
                  (editMode && field.editable) ?
                  <TextField
                    id="standard-multiline-flexible"
                    onChange={() => handleInputChange(event, field, index)}
                    multiline
                    variant="standard"
                    placeholder={field.value}
                    fullWidth
                    inputProps={{style: {fontFamily: 'Roboto', fontWeight: 600, fontSize: '20px', color: 'grey'}}}
                  />
                  :
                  <Typography sx={{ fontFamily: 'Roboto', fontWeight: 600, fontSize: '20px', color: 'grey',
                }}> {field.value} </Typography>
                }
              </Grid>
            </Grid>
          ))}
        </Box>
      </Container>

  );
}

export default Profile;
