/**
 * 
 */
package com.fpoly.repositories.irepo;

import org.springframework.stereotype.Service;

import com.fpoly.entities.Bills;

import java.util.List;


/**
 *
 * @author trucnv 
 *
 */
@Service
public interface IBillService extends IGeneralService<Bills>{
    List<Bills> getAllBillByStatus (Integer status);
    Bills getBillByIdBooking(Integer idBooking);
}
