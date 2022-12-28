/**
 * 
 */
package com.fpoly.repositories.irepo;

import com.fpoly.entities.Rooms;
import org.springframework.stereotype.Service;

import com.fpoly.entities.FacilitiesDetails;

import java.util.List;


/**
 *
 * @author trucnv 
 *
 */
@Service
public interface IFacilityDetailService extends IGeneralService<FacilitiesDetails>{
    List<FacilitiesDetails> findByRoomsAndStatus(Rooms rooms, int status);
}
