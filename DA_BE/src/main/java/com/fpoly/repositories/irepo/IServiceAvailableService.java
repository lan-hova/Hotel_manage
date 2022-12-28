/**
 * 
 */
package com.fpoly.repositories.irepo;

import com.fpoly.entities.Rooms;
import org.springframework.stereotype.Service;

import com.fpoly.entities.ServiceAvailable;

import java.util.List;


/**
 *
 * @author trucnv 
 *
 */
@Service
public interface IServiceAvailableService extends IGeneralService<ServiceAvailable>{
    List<ServiceAvailable> findByRoomsAndStatus(Rooms rooms, int status);
}
