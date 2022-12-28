/**
 * 
 */
package com.fpoly.repositories.irepo;

import com.fpoly.entities.DetailsInvoice;
import org.springframework.stereotype.Service;

import com.fpoly.entities.ServiceDetails;

import java.util.List;


/**
 *
 * @author trucnv 
 *
 */
@Service
public interface IServiceDetailService extends IGeneralService<ServiceDetails>{
    List<ServiceDetails> listByRoomAndStatus(DetailsInvoice detailsInvoice, Integer status);
}
