import React, { useState } from "react";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";

//i18n
 import i18n from '../../i18n';
 import { withNamespaces } from 'react-i18next';

// flags
import usFlag from "../../assets/img/flags/united-states.png";
import china from "../../assets/img/flags/china.png";
import russia from "../../assets/img/flags/russia.png";
import turkey from "../../assets/img/flags/turkey.png";
import vietnam from "../../assets/img/flags/vietnam.png";
import {ReactComponent as SpartanLogoBlackSmall} from "../../assets/img/spartan_black_small.svg";

const LanguageDropdown = (props) => {

    const [menu,setMenu] = useState(false);
    const [lng,setLng] = useState("English");
    //const [flag,setFlag] = useState(usFlag);

    const changeLanguageAction = (lng) => {

        //set language as i18n
        i18n.changeLanguage(lng);

        if(lng === "sp") {
            //setFlag(china);
            setLng("Chinese");
        }
        else if(lng === "gr") {
            //setFlag(russia);
            setLng("Russian");
        }
        else if(lng === "rs") {
            //setFlag(russia);
            setLng("Russian");
        }
        else if(lng === "it") {
            //setFlag(turkey);
            setLng("Turkish");
        }
        else if(lng === "eng") {
            //setFlag(usFlag);
            setLng("English");
        }
        else if(lng === "vi") {
            //setFlag(vietnam);
            setLng("Vietnamese");
        }
    }

    const toggle = () => {
        setMenu(!menu);
    }

    return (
        <React.Fragment>
            <Dropdown
                isOpen={menu}
                toggle={toggle}
                className="d-inline-block"
            >
                <DropdownToggle
                    className="mx-1 btn btn-danger"
                    tag="button"
                >
                    <i className="icon-medium icon-world icon-dark" />
                </DropdownToggle>
                <DropdownMenu className="language-switch" right>
                    <DropdownItem tag="a" href="#" onClick={() => changeLanguageAction('eng')} className={`notify-item ${lng === 'English' ? 'active' : 'none'}`}>
                        <img src={usFlag} alt="Spartan" height="12" />
                        <span className="align-middle ml-1">English</span>
                    </DropdownItem>
                    <DropdownItem tag="a" href="#" onClick={() => changeLanguageAction('sp')} className={`notify-item ${lng === 'Chinese' ? 'active' : 'none'}`}>
                        <img src={china} alt="Spartan" height="12" />
                        <span className="align-middle ml-1">Chinese</span>
                    </DropdownItem>
                    <DropdownItem tag="a" href="#" onClick={() => changeLanguageAction('gr')} className={`notify-item ${lng === 'German' ? 'active' : 'none'}`}>
                        <img src={russia} alt="Spartan" height="12" />
                        <span className="align-middle ml-1">Russian</span>
                    </DropdownItem>
                    <DropdownItem tag="a" href="#" onClick={() => changeLanguageAction('it')} className={`notify-item ${lng === 'Italian' ? 'active' : 'none'}`}>
                        <img src={turkey} alt="Spartan" height="12" />
                        <span className="align-middle ml-1">Turkish</span>
                    </DropdownItem>
                    <DropdownItem tag="a" href="#" onClick={() => changeLanguageAction('vi')} className={`notify-item ${lng === 'Vietnamese' ? 'active' : 'none'}`}>
                        <img src={vietnam} alt="Spartan" height="12" />
                        <span className="align-middle ml-1">Vietnamese</span>
                    </DropdownItem>
                </DropdownMenu>

            </Dropdown>
        </React.Fragment>
    );
}

export default withNamespaces()(LanguageDropdown);
