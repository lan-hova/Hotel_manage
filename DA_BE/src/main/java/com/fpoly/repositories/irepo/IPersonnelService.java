/**
 * 
 */
package com.fpoly.repositories.irepo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.fpoly.entities.Personnel;


/**
 *
 * @author trucnv 
 *
 */
@Service
public interface IPersonnelService extends IGeneralService<Personnel>{
    Personnel getPersonnelByUserName(String userName);
}
