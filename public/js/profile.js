let addProfileClicked = false;
let editProfileClicked = false;

document.getElementById('add-profile-btn').addEventListener('click', () => {
    if(addProfileClicked)
        return;
    console.log('we should add a profile');
    //generez un formular nou si o sa il adaug in template 
    //formularul va face un insert in profile collection si bam bam 
    let form = generateForm('/profiles/addProfile/', 'profilename');
    let parentBtn = document.getElementById('add-profile-btn').parentElement;
    parentBtn.appendChild(form)
    //console.log(parentOfBtn)
    //parentOfBtn.appendChild(form);
    addProfileClicked = true;
});

Array.prototype.forEach.call(document.getElementsByClassName('editProfilebtn'), function(btn) {
    btn.addEventListener('click', () => {
        const idProfileToEdit = btn.getAttribute("name");
        let form = generateForm('/profiles/editProfile/'+idProfileToEdit,'profileId');
        btn.parentElement(form);
        console.log('edit profile');
    });
});

//console.log(document.getElementsByClassName('editProfilebtn'));


/* Function that returns a form with 1 field and 1 submit button
* @author   Silviu
* @param    {String} inputName0  Name of the text input
* @param    {String} path  Name of the text input
* @return   {form}   the form object
*/
function generateForm(requestURL, inputName0){
    let form = document.createElement('form');
    form.setAttribute('method','post');
    form.setAttribute('action', requestURL);

    let nameInput = document.createElement('input');
    nameInput.setAttribute('type','text');
    nameInput.setAttribute('name', inputName0);

    let s = document.createElement("input"); //input element, Submit button
    s.setAttribute('type',"submit");
    s.setAttribute('value',"Submit");

    form.appendChild(nameInput);
    form.appendChild(s);
    
    return form;
}