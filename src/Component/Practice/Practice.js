import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import { Form, Formik, useFormik } from 'formik';
import * as yup from 'yup';

function Practice(props) { 
    const [open, setOpen] = useState(false);
    const [reopen, setReopen] = React.useState(false);
    const [name, setname] = useState('');
    const [price, setprice] = useState('');
    const [expiry, setexpiry] = useState('');
    const [quantity, setquantity] = useState('');
    const [data, setdata] = useState([]);
    const [Did, setDid] = useState();
    const[update,setUpdate]=React.useState(false);
    const[uid,setUid]=React.useState();
    const [fildata, setfildata] = useState([]);
    


    //   poper
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickReopen = (params) => {
        setReopen(true);
        setDid(params.id);
    }

    const getdata = () => {
        setdata();
        let localdata = JSON.parse(localStorage.getItem("medicine"));
        if (localdata !== null) {
            setdata(localdata);
        }

    }
    
    const handleClose = () => {
        setOpen(false);
        setReopen(false);
    };

    const handleEdit=(params)=>{
        setOpen(true);
        formik.setValues({
            name:params.name,
            price:params.price,
            quantity:params.quantity,
            expiry:params.expiry

        });
        setUpdate(true);
        setUid(params.id);
    }
   

    const handleUpdate=(values)=>{
      
        console.log(values,uid);
        let localData=JSON.parse(localStorage.getItem("medicine"));
        let vData=localData.map((l)=>{
            if(l.id===uid)
            {
                return {id:uid,...values};
            }
            else{
                return l;
            }
            // console.log(vData);
        })
        localStorage.setItem("medicine",JSON.stringify(vData));
        setOpen(false);
        setUpdate(false);
        setUid();
        getdata();
    }
    
    const handledelet = () => {
        //   console.log(params)
        const localdata = JSON.parse(localStorage.getItem("medicine"));
        // console.log(fdata);
        let fdata = localdata.filter((l, i) => l.id !== Did);
        localStorage.setItem("medicine", JSON.stringify(fdata));

        getdata();
        setDid();
        handleClose();
    } 

    useEffect(() => {
        getdata();
    }, [])
     

     
    let  handleSubmit = (values) => {
        console.log(name, price, quantity, expiry);
          
        let data = {
            id: Math.floor(Math.random() * 1000),
            name: values.name,
            price: values.price,
            expiry: values.expiry,
            quantity: values.quantity
        };
         
        //  console.log(data);

        // 
        handleClose(false);
        setname('');
        setprice('');
        setexpiry('');
        setquantity('');
        getdata();
        let localdata = JSON.parse(localStorage.getItem('medicine'));
        if (localdata === null) {
            localStorage.setItem('medicine', JSON.stringify([data]));
        }
        else {

            localdata.push(data);
            localStorage.setItem('medicine', JSON.stringify(localdata));
        }
        
       
    } 
    //   searching 

    const handlesearch = (jigu) => {
          
        let localdata = JSON.parse(localStorage.getItem("medicine"));
        // console.log(localdata); 
        let fidata =  localdata.filter ( (l) => (l.id.toString().includes(jigu) || 
            l.name.toString().toLowerCase().includes(jigu.toLowerCase()) ||
            l.price.toString().includes(jigu)||
            l.expiry.toString().includes(jigu)||
            l.quantity.toString().includes(jigu)
             

         ))
           setfildata(fidata);
           console.log(fidata);
    }
    let schema = yup.object().shape({
        name: yup.string().required('enter a name valid'),
        price: yup.number().required('enter to price'),
        expiry: yup.number().required('enter to expiry'),
        quantity: yup.number().required('enter quantity')
    });
    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            expiry: '',
            quantity: ''
        },
        validationSchema: schema,
        onSubmit: values => {
            if(update){
                handleUpdate(values);
            }
            else{
                handleSubmit(values);
            }
            // alert(JSON.stringify(values, null, 2));
            handleClose();

        },
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: ' name', width: 130 },
        { field: 'price', headerName: 'price', width: 130 },
        { field: 'quantity', headerName: 'quantity', width: 130 },
        { field: 'expiry', headerName: 'expiry', width: 130 },


        {
            field: 'action', headerName: "action", width: 130,
            renderCell: (params) => {
                return (
      
                      <>

                        <IconButton aria-label="delete" onClick={() => handleClickReopen(params)} >
                            <DeleteIcon />
                        </IconButton>

                        <IconButton aria-label="edit" onClick={() => handleEdit(params.row)}>
                      <ModeEditIcon />
                    </IconButton>
                      </>
                )
            }


        }
    ];
    


    const mystyle = {
        margin: "70px   "
      };
    // console.log(formik.errors.name);

    return (
       
      
      //  <Box sx={{ marginLeft: 20 }}>
        <div style={mystyle}> 
          <TextField
                                autoFocus
                                margin="serch"
                                label="  search"
                                fullWidth
                                variant="standard"
                                name="search"
                                onChange={(e)=>handlesearch(e.target.value)}
                               
                              
                            
                            />
            <Button variant="outlined" onClick={handleClickOpen} >
                Add medicines
            </Button>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid xs={5}
                    rows={data}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>add medicines</DialogTitle>
                <Formik values={formik}>
                    <Form onSubmit={formik.handleSubmit}>
                        <DialogContent>

                            <TextField
                                autoFocus
                                margin="dense"
                                label=" medicine name"
                                fullWidth
                                variant="standard"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            
                            />
                            {
                                formik.errors.name ? <p>{formik.errors.name} </p> : null
                            }

                            <TextField
                                autoFocus
                                margin="dense"
                                // id="price"
                                label=" medicine price"
                                fullWidth
                                variant="standard"
                                name="price"
                                onChange={formik.handleChange}
                                value={formik.values.price}
                                
                            />
                            {
                                formik.errors.name ? <p>{formik.errors.name} </p> : null
                            }
                            <TextField
                                autoFocus
                                margin="dense"
                                // id="expiry"
                                label="expiry"
                                name="expiry"
                                fullWidth
                                variant="standard"
                                // onChange={(e) => setexpiry(e.target.value)}
                                onChange={formik.handleChange}
                                value={formik.values.expiry}
                            />
                            {
                                formik.errors.name ? <p>{formik.errors.name} </p> : null
                            }

                            <TextField
                                autoFocus
                                margin="dense"
                                // id=" quantity"
                                label=" quantity"
                                name="quantity"
                                fullWidth
                                variant="standard"
                                onChange={formik.handleChange}
                                value={formik.values.quantity}
                            />

                            {
                                formik.errors.name ? <p>{formik.errors.name} </p> : null
                            }
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Submit</Button>
                    </DialogActions>
                    </Form>


                   
                </Formik>

            </Dialog>
            {/* popoep  */}
           
                {/* popep box */}

                <Dialog
                    open={reopen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {" Are you sure delet? "}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleClose}> no</Button>
                        <Button onClick={handledelet} autoFocus>
                            yes
                        </Button>
                    </DialogActions>
                </Dialog>
            
            </div>

      
    );
}

export default Practice;


