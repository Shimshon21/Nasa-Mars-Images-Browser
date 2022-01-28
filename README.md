[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=6573296&assignment_repo_type=AssignmentRepo)
# ex4-nodejs
Nasa Mars Images browser with database. 

<h1>Shimshon Polak</h1>
<p>Email: shimshonpo@edu.hac.ac.il</p>

<h1>Execution</h1>
<div>
    NASA Mars rovers images browser which allowing to search rovers pictures according :<br/>
    <ul>
        <li>Earth date time or Solar day(Sol)</li>
        <li>Mission rover name</li>
        <li>Camera rover</li>
    </ul>
    In order to browse mars images,a registration is required to be recognized in the users database.<br/>
    <br/>
    The registration is divided to 2 steps.<br/>
    First the user required to enter:
    <ul>
        <li>email</li>
        <li>first name</li>
        <li>last name</li>
    </ul>
    After the initial registration the data is stored in the cookie,<br/>
    and the user required to insert password with 8 chars 
    length and conformation password in one minute.<br/>
    If he did not register the password on time he will be redirected
    to the initial registration page and his data will be deleted.<br/>
    When registrations is successful the user will be redirect to the login page and the data will be stored in the 'Users' data base.
    <br/>
    <br/>
    In the login page after the user typed his email and password credentials,<br/> he will be redirected to the main page of the mars images browser.
    <br/>
    <br/>
    After successful login, in the browsing page user can do the following operations in the navigation tab:
    <br/>
    1.Log out<br/>
    2.See his own data (by pressing who am i)<br/>
    <br/>
    The user can look for the images with the data mentioned before.<br/>
    The data validation made by two separates modules:<br/>
    -One for the forum input data (such as empty string.)<br/>
    -Second for the manifest data validation.(such as date time input is in range of landing time and maximum time)<br/>
    <br/>
    On each result shown in the list of cards according the given data search,<br/> the user can see the image full size or add it into saved list<br/>
    that can played on carousel slideshow or deleted later.<br/>
    If user is trying to add an existed image in the list, a modal message will be shown.
    <br/>
    Each call is made by api module which request the data according the given url  and deal with the data<br/> according the function given as parameter.
    <br/>
    <br/>
    For each Image the user decide to add to his own list, the data will be saved in database of 'Images'.
    <br/>
    The images data saved in the data base are extracted from the existed DOM to reduce space storage.
    <br/>
    For each operation add image,remove image or find all user images, an ajax request is send accordingly
    and the data or the relevant answer is returned to the user.
    <br/>
    <br/>
    Notes:<br/>
    User registration doesnt support hebrew letters.
    <br/>
    <br/>
    User registration and login validation made in the client and the server side
    <br/>
    <br/>
    The user is connected via session, in case the session expired<br/>(user disconnected from different tab,
    or session ended etc)<br/> he will automatically redirected to error page which redirect to login page.<br/>
    <br/>
    The user can delete images one by one by pressing the 'Edit list' button
    <br/>
    <br/>
    To clear input warning press 'clear' button.
    <br/>
    <br/>
    User for example: email:example@gmail.com , password 12345678
</div>
<p>
Open console, execute : node bin/www
</p>
<p>
Then open your browser at http://localhost:3000
</p>
<h1>Assumptions</h1>
<p>
  
</p>
